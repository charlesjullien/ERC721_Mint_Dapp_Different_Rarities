#!/bin/bash

cd Venus

for i in {1..350}
do
  touch $i.json
  cat <<EOT >> "$i.json"
{
  "item": "HD #$i",
  "name": "Queen Tracy",
  "image": "https://bafybeiappa7l3lp5msd3uhzborstbszfra4fnppymc5v4kd5ar5ecbwbgm.ipfs.nftstorage.link/1.JPG",
  "faction": "Venus",
  "rarity_tier": "1",
  "level": "1",
  "stats": [
    {
      "trait_type": "HP",
      "value": "1"
    },
    {
      "trait_type": "Strength",
      "value": "3"
    },
    {
      "trait_type": "Agility",
      "value": "2"
    },
    {
      "trait_type": "Resistance",
      "value": "3"
    }
  ]
}
EOT
done

ITEMS=$(ls -la *.json | wc -l)
echo "Venus items generated = $ITEMS"