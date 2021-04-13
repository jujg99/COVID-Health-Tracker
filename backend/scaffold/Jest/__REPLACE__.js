// Simple Example Module
class __REPLACE__ {

    constructor() {
        this.meaning = 42;
    }

    method1(input) {
        if (input === undefined) {
            return null;
        }
        return `Got input: ${input}`;
    }

}

module.exports = __REPLACE__;
