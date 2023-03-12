#!/bin/bash

cd Uranus

#for i in {806..895}
for i in {1..90}
do
  touch $i.json
  cat <<EOT >> "$i.json"
{
  "item": "HD #$i",
  "name": "Uralos",
  "image": "https://bafybeiappa7l3lp5msd3uhzborstbszfra4fnppymc5v4kd5ar5ecbwbgm.ipfs.nftstorage.link/4.JPG",
  "faction": "Uranus",
  "rarity_tier": "4",
  "level": "1",
  "stats": [
    {
      "trait_type": "HP",
      "value": "3"
    },
    {
      "trait_type": "Strength",
      "value": "5"
    },
    {
      "trait_type": "Agility",
      "value": "3"
    },
    {
      "trait_type": "Resistance",
      "value": "2"
    }
  ]
}
EOT
done

ITEMS=$(ls -la *.json | wc -l)
echo "Uranus items generated = $ITEMS"