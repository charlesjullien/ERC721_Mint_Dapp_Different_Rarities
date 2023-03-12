#!/bin/bash

cd Jupiter

#for i in {596..805}
for i in {1..210}
do
  touch $i.json
  cat <<EOT >> "$i.json"
{
  "item": "HD #$i",
  "name": "Jesua",
  "image": "https://bafybeiappa7l3lp5msd3uhzborstbszfra4fnppymc5v4kd5ar5ecbwbgm.ipfs.nftstorage.link/3.JPG",
  "faction": "Jupiter",
  "rarity_tier": "3",
  "level": "1",
  "stats": [
    {
      "trait_type": "HP",
      "value": "1"
    },
    {
      "trait_type": "Strength",
      "value": "2"
    },
    {
      "trait_type": "Agility",
      "value": "3"
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
echo "Jupiter items generated = $ITEMS"