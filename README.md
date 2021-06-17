## Structure

I moved all the original files into src/.

## To Run

```
npm install --global yarn
yarn install
yarn start
```

Open http://localhost:9012/

It should autoreload when you make a change.

## Keyholders Script
fetch the first 100 like this:
```
./keyholders.sh
```

then copy the 'endCursor' value and run the script again:

```
./keyholders.sh YXJyYXljb25uZWN0aW9uOjk5
```

run until you see `'hasNextPage': False`

copy the output into the keyholders.txt

(optional) count the number of lines in keyholders.txt, make sure it's the same as the number on OpenSea

```
wc -l keyholders.txt
```

then copy the keyholders into the smart contract.

