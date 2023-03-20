#!/bin/bash

cd Marlavo
ID=0

#for i in {949..1000}
for i in {1..52}
do
  touch $i.json
  ID=$((i+948))
  cat <<EOT >> "$i.json"
{
  "item": "HD #$ID",
  "name": "Marlavo",
  "image": "https://bafybeibzemgjkhnw2zocw74jsjebwcbgbygoyeihzmascy47gmwoysig6e.ipfs.nftstorage.link/6.JPG",
  "faction": "Ares",
  "rarity_tier": "6",
  "level": "1",
  "stats": [
    {
      "trait_type": "HP",
      "value": "1"
    },
    {
      "trait_type": "Strength",
      "value": "10"
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
echo "Ares items generated = $ITEMS"