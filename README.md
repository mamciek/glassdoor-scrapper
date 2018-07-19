# Glassdoor.com scrapper

This scrapper allows to collect information about companies from glassdoor.com.
Data is saved in JSON files to allow further processing (e.g. filtering, sorting).

## Usage

`$ npm install`

`$ ./bin/glassdoor`

## Credentials

All of the commands require file with glassdoor.com credentials (by default: `.auth.json`).
Create the file and fill in your username and password:
```
{
  "username": "john.doe@gmail.com",
  "password": "<password>"
}
```

## Examples

Search for companies located in Dublin:

`$ glassdoor search --search-string 'Dublin, Dublin (Ireland)' --outfile dublin-list.json`

Collect ratings of companies

`$ glassdoor search --infile dublin-list.json --outfile dublin-list.json`
