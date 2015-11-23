# c32-fhir
C32 to FHIR parser/converter

Convert C32 xml to FHIR bundle

[![NPM](https://nodei.co/npm/c32-fhir.png)](https://nodei.co/npm/c32-fhir/)

[![Build Status](https://travis-ci.org/amida-tech/c32-fhir.svg)](https://travis-ci.org/amida-tech/c32-fhir) [![Coverage Status](https://coveralls.io/repos/amida-tech/c32-fhir/badge.svg?branch=master&service=github)](https://coveralls.io/github/amida-tech/c32-fhir?branch=master) ![dependencies status](https://david-dm.org/amida-tech/c32-fhir.svg)

This library provides the following functionality
- Parse XML document using [sax js](https://github.com/isaacs/sax-js) parser
- Generate set of resources conformant to [FHIR DSTU2](http://www.hl7.org/fhir/index.html) 

Usage example:

```javascript
'use strict';

var _ = require('lodash');

var bbcms = require('./index');

// Make it transactional bundle
var makeTransactionalBundle = function (bundle, base, patientId) {
    _.each(bundle.entry, function (value) {
        value.request = {
            'method': (value.resource.resourceType === 'Patient') ? 'PUT' : 'POST',
            'url': (value.resource.resourceType === 'Patient') ? 'Patient/' + patientId : value.resource.resourceType
        };
        value.base = base;
    });
    bundle.type = 'transaction';
    return bundle;
};

var request = require('request');

// Get sample file from GitHub
var istream = request.get('https://raw.githubusercontent.com/amida-tech/blue-button/master/test/fixtures/parser-c32/VA_CCD_Sample_File_Version_12_5_1.xml');

istream
    .pipe(new bbcms.C32ParserStream("test" /* PatientId */))
    .on('data', function (data) {
        var bundle = JSON.stringify(makeTransactionalBundle(data), null, '  ');
		
        console.log(bundle); // Result bundle
		
    })
    .on('error', function (error) {
        console.log(error);
    });
```
## License

Licensed under [Apache 2.0](./LICENSE)
