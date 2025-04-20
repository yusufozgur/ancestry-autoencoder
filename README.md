# Ancestry Autoencoder

Ancestry Autoencoder is a tool to train variational autoencoder machine learning models on genotyping data for discovering population structures by unsupervised clustering of genotypes.

# Usage
1. Start the eel server
2. go to localhost:8000
3. upload genomes, must be phased, for phasing you can use tools like beagle.
4. Train model / Load Model
5. Open / Create sample annotation tsv file by providing the path
6. annotate the samples by selecting them on the plotly plot.
7. save the annotation.tsv for downstream applications.