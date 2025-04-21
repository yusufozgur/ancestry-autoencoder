# Ancestry Autoencoder

Ancestry Autoencoder is a tool to train variational autoencoder machine learning models on genotyping data for discovering population structures by unsupervised clustering of genotypes.

# Run

Run dev server
```
fastapi dev backend/__main__.py
```

Run tests
```
pytest -s
```
"-s" is for capturing stdout during tests

# TODO

- [x] VCF Manager
  - [x] load
  - [x] check headers
  - [x] check it is phased
  - [x] method: get sample names
  - [x] method: get phased genotypes
  - [x] use it in api
- [ ] Autoencoder lightining
- [ ] add political entities to names for testing
- [ ] return the latent space representations of samples by api

# Usage

1. Start the eel server
2. go to localhost:8000
3. choose genome .vcf/.vcf.gz, must be phased, for phasing you can use tools like beagle.
4. Train model / Load Model
5. Open / Create sample annotation tsv file by providing the path
6. annotate the samples by selecting them on the plotly plot.
7. save the annotation.tsv for downstream applications.

