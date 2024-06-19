#!/bin/bash

# Fetch stable

FIAT_STABLES_ID=f4dfb0df-e211-45a7-897e-5acfd9f7f713
ALGO_STABLES_ID=604f2755ebccdd50cd175fc2

# fetch all categories
curl -H "X-CMC_PRO_API_KEY: ${CMC_API_KEY}" -H "Accept: application/json" "https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories" | python3 -m json.tool > test/data/categories.json


curl -H "X-CMC_PRO_API_KEY: ${CMC_API_KEY}" -H "Accept: application/json" "https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=${FIAT_STABLES_ID}" | python3 -m json.tool > test/data/fiat-stablecoins.json

curl -H "X-CMC_PRO_API_KEY: ${CMC_API_KEY}" -H "Accept: application/json" "https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=${ALGO_STABLES_ID}" | python3 -m json.tool > test/data/fiat-stablecoins.json

