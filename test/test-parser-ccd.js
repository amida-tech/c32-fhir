/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts"/>
"use strict";

var expect = require('chai').expect;
var fs = require('fs');
var request = require('request');
var _ = require('lodash');

var bbcms = require("../index");

var testoOn = function (infile, outfile, goldfile, done) {
    var istream = fs.createReadStream(infile, 'utf-8');
    istream
        .pipe(new bbcms.C32ParserStream("test"))
        .on('data', function (data) {
            expect(data).to.exist;
            fs.writeFile(outfile, JSON.stringify(data, null, '  '), function (err2) {
                if (err2) {
                    return done(err2);
                }
                fs.readFile(goldfile, function (err, data2) {
                    if (err) {
                        return done(); // Not an error, just skip comparison
                    }
                    try {
                        expect(JSON.parse(data2.toString())).to.be.eql(data);
                        return done(err);
                        if (_.isEqual(JSON.parse(data2.toString()), data))
                            return done(err);
                        else
                            return done(new Error("Compare fails"));
                    } catch (ee) {
                        return done(ee);
                    }
                });
            });
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
            .pipe(new bbcms.C32ParserStream('test'))
            .on('data', function (data) {
                expect(data).to.exist;
                fs.writeFile(__dirname + '/artifacts/VA_CCD_Sample_File_Version_12_5_1.json', JSON.stringify(data, null, '  '), function (err2) { done(err2); });
            })
            .on('error', function (error) {
                done(error);
            });

    });

    it('"mhv_VA_CCD_WATSON_20140909_1002" as input', function (done) {

        testoOn(__dirname + '/../../private-records/blue-button/tests/proprietary/watson/mhv_VA_CCD_WATSON_20140909_1002.xml',
            __dirname + '/artifacts/mhv_VA_CCD_WATSON_20140909_1002.json',
            __dirname + '/artifacts/mhv_VA_CCD_WATSON_20140909_1002-gold.json',
            done);

    });

});
