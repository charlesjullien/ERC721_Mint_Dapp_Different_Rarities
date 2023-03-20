#!/bin/bash

cd Zeosine
ID=0

#for i in {596..805}
for i in {1..210}
do
  touch $i.json
  ID=$((i+595))
  cat <<EOT >> "$i.json"
{
  "item": "HD #$ID",
  "name": "Zeosine",
  "image": "https://bafybeibzemgjkhnw2zocw74jsjebwcbgbygoyeihzmascy47gmwoysig6e.ipfs.nftstorage.link/3.JPG",
  "faction": "Zelia",
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
echo "Zelia items generated = $ITEMS"