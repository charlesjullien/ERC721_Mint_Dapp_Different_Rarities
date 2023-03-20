#!/bin/bash

cd Urania
ID=0

#for i in {806..895}
for i in {1..90}
do
  touch $i.json
  ID=$((i+805))
  cat <<EOT >> "$i.json"
{
  "item": "HD #$ID",
  "name": "Urania",
  "image": "https://bafybeibzemgjkhnw2zocw74jsjebwcbgbygoyeihzmascy47gmwoysig6e.ipfs.nftstorage.link/4.JPG",
  "faction": "Uralki",
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
echo "Uralki items generated = $ITEMS"