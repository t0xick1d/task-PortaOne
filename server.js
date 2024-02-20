const express = require('express');

const app = express();

app.listen(3000);

const fs = require('fs');
const bz2 = require('unbzip2-stream');

let values = [];

const answearNumber = {
   maxNumber: null,
   minNumber: null,
   median: null,
   arithmeticMeanValue: null,
   increase: null,
   reduction: null,
};

const convertToNumber = (array) => (arrayNumber = array.map((e) => Number(e)));

const maxMinNumber = (array) => {
   answearNumber.maxNumber = array[0];

   answearNumber.minNumber = array[0];

   for (let i of array) {
      if (typeof i !== 'number' || isNaN(i)) {
         break;
      }
      if (i > answearNumber.maxNumber) {
         answearNumber.maxNumber = i;
      }
      if (i < answearNumber.minNumber) {
         answearNumber.minNumber = i;
      }
   }

   let sum = array.reduce((total, num, index) => {
      if (isNaN(num)) {
         console.log(`rat in number: ${index}`);
         return total + 0;
      }
      return total + num;
   }, 0);

   answearNumber.arithmeticMeanValue = sum / array.length;

   let sortedArray = array.slice().sort((a, b) => a - b);
   let middle = Math.floor(sortedArray.length / 2);

   if (sortedArray.length % 2 === 0) {
      answearNumber.median = (sortedArray[middle - 1] + sortedArray[middle]) / 2;
   } else {
      answearNumber.median = sortedArray[middle];
   }
   let arrayProbableIncrease = [];
   let arrayFinalyIncrease = [array[1]];
   let arrayProbableReduction = [];
   let arrayFinalyReduction = [array[1]];
   for (let i = 0; i < array.length; i++) {
      if (typeof i !== 'number' || isNaN(i)) {
         if (arrayProbableIncrease.length > arrayFinalyIncrease.length) {
            arrayFinalyIncrease = arrayProbableIncrease;
            arrayProbable = [];
         }
         if (arrayProbableReduction.length > arrayFinalyReduction.length) {
            arrayFinalyReduction = arrayProbableReduction;
            arrayProbable = [];
         }
         break;
      }
      if (array[i] > array[i - 1]) {
         arrayProbableIncrease.push(array[i]);
      } else {
         arrayProbableIncrease = [];
      }
      if (arrayProbableIncrease.length > arrayFinalyIncrease.length) {
         arrayFinalyIncrease = arrayProbableIncrease;
         arrayProbableIncrease = [];
      }
      if (array[i] < array[i - 1]) {
         arrayProbableReduction.push(array[i]);
      } else {
         arrayProbableReduction = [];
      }
      if (arrayProbableReduction.length > arrayFinalyReduction.length) {
         arrayFinalyReduction = arrayProbableReduction;
         arrayProbable = [];
      }
   }
   answearNumber.increase = arrayFinalyIncrease;
   answearNumber.reduction = arrayFinalyReduction;
};

fs.createReadStream('10m.txt.bz2')
   .pipe(bz2())
   .on('data', function (chunk) {
      let lines = chunk.toString().split('\n');
      values = values.concat(lines);
   })
   .on('end', function () {
      const arrayNumber = convertToNumber(values);
      maxMinNumber(arrayNumber);
      console.log(answearNumber.maxNumber);
      console.log(answearNumber.minNumber);
      console.log(answearNumber.arithmeticMeanValue);
      console.log(answearNumber.median);
      console.log(answearNumber.increase);
      console.log(answearNumber.reduction);
   });
