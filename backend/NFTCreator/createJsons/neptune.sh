#!/bin/bash

cd Neptune

#for i in {896..948}
for i in {1..53}
do
  touch $i.json
  cat <<EOT >> "$i.json"
{
  "item": "HD #$i",
  "name": "Nuralis",
  "image": "https://bafybeiappa7l3lp5msd3uhzborstbszfra4fnppymc5v4kd5ar5ecbwbgm.ipfs.nftstorage.link/5.JPG",
  "faction": "Neptune",
  "rarity_tier": "5",
  "level": "1",
  "stats": [
    {
      "trait_type": "HP",
      "value": "4"
    },
    {
      "trait_type": "Strength",
      "value": "1"
    },
    {
      "trait_type": "Agility",
      "value": "3"
    },
    {
      "trait_type": "Resistance",
      "value": "8"
    }
  ]
}
EOT
done

ITEMS=$(ls -la *.json | wc -l)
echo "Neptune items generated = $ITEMS"