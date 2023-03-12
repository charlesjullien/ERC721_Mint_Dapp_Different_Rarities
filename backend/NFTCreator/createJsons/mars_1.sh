#!/bin/bash

cd Mars_1

#for i in {351..595}
for i in {1..245}
do
  touch $i.json
  cat <<EOT >> "$i.json"
{
  "item": "HD #$i",
  "name": "Marsio",
  "image": "https://bafybeiappa7l3lp5msd3uhzborstbszfra4fnppymc5v4kd5ar5ecbwbgm.ipfs.nftstorage.link/2.JPG",
  "faction": "Mars",
  "rarity_tier": "2",
  "level": "1",
  "stats": [
    {
      "trait_type": "HP",
      "value": "3"
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
      "value": "2"
    }
  ]
}
EOT
done

ITEMS=$(ls -la *.json | wc -l)
echo "Mars_1 items generated = $ITEMS"