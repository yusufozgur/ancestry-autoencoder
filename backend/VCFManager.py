import polars as pl
import numpy as np
import re

class VCFSchemaValidationError(Exception):
    def __init__(self, message):
        super().__init__(message)

class VCFNotPhasedError(Exception):
    def __init__(self, message):
        super().__init__(message)

class VCFManager:
    vcf_path: str
    VCF_HEADERS = ["#CHROM", "POS", "ID", "REF", "ALT",
                   "QUAL","FILTER", "INFO", "FORMAT"]
    lf: pl.LazyFrame
    sample_names: list[str]
    split_gts_sample_names: list[str] # is like sample1_chr1, sample1_chr2, ...
    split_gts_np: np.ndarray # shape is (no_of_samples*2, no_of_snps)

    def __init__(self, vcf_path):
        self.vcf_path = vcf_path
        self.lf = pl.scan_csv(
            self.vcf_path,
            separator="\t",
            low_memory=True,
            infer_schema=True,
            comment_prefix="##"
        )

        schema = self.lf.collect_schema().names()

        # Check if schema starts with VCF_HEADERS
        if not schema[:len(self.VCF_HEADERS)] == self.VCF_HEADERS:
            raise VCFSchemaValidationError(
                f"Schema does not start with required VCF headers: {self.VCF_HEADERS}"
            )
        
        self.sample_names = schema[len(self.VCF_HEADERS):]

        # Test if vcf is phased, if not, throw error
        phased = self.is_vcf_phased()
        
        print("\nChecking whether the vcf is phased by looking at the first row")
        if not phased:
            raise VCFNotPhasedError("VCF is not detected as phased, please provide a phased vcf")
        
        self.get_phased_genotypes_as_numpy()
        

    def is_vcf_phased(self):
        """
        Test if all alleles in the first row are phased
        """
        first_row_vals = (
            self.lf
            .first().collect()
            .drop(self.VCF_HEADERS)
            .row(0)
            )
        test_vals_for_phased = [self.is_allele_phased(x) for x in first_row_vals]
        return all(test_vals_for_phased)

    @staticmethod
    def is_allele_phased(allele: str):
        """
        Test if a single allele like 1|1 or 0/1 or 1/1:2 is phased
        """
        if re.match(r"\d+/\d+.*", allele):
            return False
        if re.match(r"\d+[|]\d+.*", allele):
            return True
        return False

    def get_phased_genotypes_as_numpy(self):
        """
        Remove extra info after colon, 1|1:2 -> 1|1
        Split phased genotypes by "|"
        """

        #remove vcf specific cols
        split_gts = self.lf.drop(*self.VCF_HEADERS)
        split_gts = (
            split_gts
            #remove dosage info after : in 1|0:dosage, in case vcf is imputed  
            .select(pl.all().str.replace(r":.*$", ""))
            #3. seperate phased genotypes 1|0 to 1 in samplename_chr1 and 0 in samplename_chr2 cols
            .select(
                    # For every column, create two new columns (_col1 and _col2)
                    [
                        pl.col(col).str.split("|").list.get(0).alias(f"{col}_chr1")  # First part (before "|")
                        for col in split_gts.collect_schema().names()
                    ] + [
                        pl.col(col).str.split("|").list.get(1).alias(f"{col}_chr2")  # Second part (after "|")
                        for col in split_gts.collect_schema().names()
                    ]
                )
            #4. cast cols to number
            .select(
                pl.all().cast(pl.Int8)
            )
            .collect()
        )

        self.split_gts_sample_names = split_gts.columns
        self.split_gts_np = split_gts.transpose().to_numpy()