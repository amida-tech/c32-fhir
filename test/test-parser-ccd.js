/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts"/>
"use strict";

var expect = require('chai').expect;
var fs = require('fs');
var request = require('request');

var bbcms = require("../index");

var testoOn = function (infile, outfile, goldfile, done) {
    var istream = fs.createReadStream(infile, 'utf-8');
    expect(istream).to.exist;

    istream
        .pipe(new bbcms.C32ParserStream())
        .on('data', function (data) {
            expect(data).to.exist;
            fs.writeFile(outfile, JSON.stringify(data, null, '  '));

            if (goldfile) {
                var gold = fs.readFileSync(goldfile, 'utf-8');
                expect(JSON.parse(gold)).to.eql(data);
            }

        })
        .on('finish', function () {
            done();
        })
        .on('error', function (error) {
            done(error);
        });
};

describe('C32 parser test', function () {

    it('"VA_CCD_Sample_File_Version_12_5_1.xml" as input', function (done) {

        var request = require('request');
        var data = request.get('https://raw.githubusercontent.com/amida-tech/blue-button/master/test/fixtures/parser-c32/VA_CCD_Sample_File_Version_12_5_1.xml');

        data
            .pipe(new bbcms.C32ParserStream())
            .on('data', function (data) {
                expect(data).to.exist;
                fs.writeFile(__dirname + '/artifacts/VA_CCD_Sample_File_Version_12_5_1.json', JSON.stringify(data, null, '  '));
            })
            .on('finish', function () {
                done();
            })
            .on('error', function (error) {
                done(error);
            });

    });

    /*it('"mhv_VA_CCD_WATSON_20140909_1002" as input', function (done) {

        testoOn(__dirname + '/../../private-records/blue-button/tests/proprietary/watson/mhv_VA_CCD_WATSON_20140909_1002.xml',
            __dirname + '/artifacts/mhv_VA_CCD_WATSON_20140909_1002.json',
            __dirname + '/artifacts/mhv_VA_CCD_WATSON_20140909_1002-gold.json',
            done
        );

    });*/

});
