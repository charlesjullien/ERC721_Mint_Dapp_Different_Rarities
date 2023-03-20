#!/bin/bash

cd Aphrodisia

for i in {1..350}
do
  touch $i.json
  cat <<EOT >> "$i.json"
{
  "item": "HD #$i",
  "name": "Aphrodisia",
  "image": "https://bafybeibzemgjkhnw2zocw74jsjebwcbgbygoyeihzmascy47gmwoysig6e.ipfs.nftstorage.link/1.JPG",
  "faction": "Aphrolia",
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
echo "Aphrolia items generated = $ITEMS"