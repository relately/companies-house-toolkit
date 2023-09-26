# Companies House Toolkit

Documenting, standardising and converting freely available UK Companies House data to make it easier for further analysis.

Companies House data is notoriously complicated, inconsistent and badly documented but it provides a wealth of valuable information that has relevance to many industries and applications.

This project's goal is to provide a set of tools to help overcome the mentioned issues and to make it much easier to understand and use the data elsewhere.

## Features

Our current feature set is quite small and focussed on only a few of the core Companies House Data Products as we work towards our first milestone.

We are working on supporting for the following Products:

- **Product 217** - Companies snapshot *(complete)*
- **Product 216** - Company officers with resignations *(in progress)*
- **Products 183 and 101** - Companies with addresses, snapshot and updates respectively *(in progress)*
- **Products 195 and 198** - Company officers, snapshot and updates respectively *(in progress)*

For each, we will offer the following features:

- Outputting to either CSV or JSON regardless of the source file type (including Companies House proprietary `.dat` files)
- Converting data types to standard formats (e.g. dates to ISO-8601)
- Applying updates to the provided snapshot files to output up to date unified snapshots up to a given date
- Documentation of our output data formats

## Getting Started

We're currently working towards our first development milestone so have not yet published our code to NPM.

In the meantime it's possible to run the CLI by:

- cloning this repository
- running `npm install`
- running the CLI with `npm start --silent -- {args}`. This uses [ts-node](https://www.npmjs.com/package/ts-node) under the hood.

Once we've published our first version to NPM it will be possible to run the CLI directly without the need for ts-node.

## Usage Examples

### Output JSON to `stdout`

```bash
npm start --silent -- convert --json prod217.csv
```

### Output CSV to a file

```bash
npm start --silent -- convert prod217.csv > converted.csv
```


## Tests

Run all tests with

```bash
npm test
```

or watch with 

```bash
npm run test:watch
```

### Linting

We use ESLint for linting

```bash
npm run lint
```

### Type Checking

Our code is written in Typescript and can be type checked with

```bash
npm run typecheck
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details