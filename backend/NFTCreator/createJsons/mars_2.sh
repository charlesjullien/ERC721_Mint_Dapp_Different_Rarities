#!/bin/bash

cd Mars_2

#for i in {949..1000}
for i in {1..52}
do
  touch $i.json
  cat <<EOT >> "$i.json"
{
  "item": "HD #$i",
  "name": "Melorcom",
  "image": "https://bafybeiappa7l3lp5msd3uhzborstbszfra4fnppymc5v4kd5ar5ecbwbgm.ipfs.nftstorage.link/6.JPG",
  "faction": "Mars",
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
echo "Mars_2 items generated = $ITEMS"