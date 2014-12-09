#!/bin/sh

GRUNT=${GRUNT:-grunt}
NPM=${NPM:-npm}
BOWER=${BOWER:-bower}

${NPM} install
${BOWER} install
${GRUNT}
