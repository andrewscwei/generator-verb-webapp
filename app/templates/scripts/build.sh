#!/bin/bash

set -e

docker build -f dockerfile -t <%= appname %> .
