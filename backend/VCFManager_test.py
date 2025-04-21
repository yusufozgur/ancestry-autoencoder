from backend.VCFManager import VCFManager

v = VCFManager("data/test_small.vcf")

def test_VCF_sample_load():
    with open("data/sample_names", "r") as file:
        sample_names = [line.strip() for line in file.readlines()]
    assert v.sample_names == sample_names
    assert len(v.sample_names) == 7614
    assert v.split_gts_np.shape == (7614*2,510)

def test_VCF_phased_detector():
    assert v.is_allele_phased("1|1") == True
    assert v.is_allele_phased("1|1:2") == True
    assert v.is_allele_phased("1/1") == False
    assert v.is_allele_phased("1/1:2") == False
    assert v.is_allele_phased("1") == False
    assert v.is_allele_phased("1:2") == False