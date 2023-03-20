#!/bin/bash

cd Nelkor
ID=0

#for i in {896..948}
for i in {1..53}
do
  touch $i.json
  ID=$((i+895))
  cat <<EOT >> "$i.json"
{
  "item": "HD #$ID",
  "name": "Nelkor",
  "image": "https://bafybeibzemgjkhnw2zocw74jsjebwcbgbygoyeihzmascy47gmwoysig6e.ipfs.nftstorage.link/5.JPG",
  "faction": "Neptalia",
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
echo "Neptalia items generated = $ITEMS"