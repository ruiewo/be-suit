#!/bin/bash

npm install
npx prisma db push
npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seedFaker.ts