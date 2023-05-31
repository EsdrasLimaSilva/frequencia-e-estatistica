export interface Class {
    lower: { value: number; included: true };
    upper: { value: number; included: boolean };
    mediumPoint: number;
    absFrequency: number;
    absAcumFrequency: number;
    relFrequency: number;
    relAcumFrequency: number;
}

export default function useStats() {
    /**
     * 
     * @param num the number itself
     * @param decimalPlaces number of decimal places
     * @returns the rounded number based on the 0.5 critery
     */
    const toRound = (num: number, decimalPlaces: number) => {
        const calcNumber = num * Math.pow(10, decimalPlaces);
        const decimalDifference = (calcNumber - Math.floor(calcNumber)) * 10;

        if (decimalDifference === 5) {
            const leftDigit = Math.floor(calcNumber % 10);
            let fixedNumber;

            if (leftDigit % 2 == 0)
                fixedNumber = Math.floor(calcNumber) / Math.pow(10, decimalPlaces);
            else fixedNumber = Math.ceil(calcNumber) / Math.pow(10, decimalPlaces);

            return fixedNumber;
        }

        return Math.round(calcNumber) / Math.pow(10, decimalPlaces);
    };

    /**
     *
     * @param classe class of range
     * @param data the data itself
     * @returns the absolute frequency
     */
    const calcAbsFrequency = (classe: Class, data: number[]) => {
        let frequency = 0;

        data.forEach((number) => {
            if (!classe.upper.included) {
                if (number >= classe.lower.value && number < classe.upper.value) frequency++;
            } else {
                if (number >= classe.lower.value && number <= classe.upper.value) frequency++;
            }
        });

        return frequency;
    };

    /**
     * Calculate the number of necessary classes based the IBGE criterion:
     * @param n number of elements
     * @returns number of necessary classes
     */
    const numOfClasses = (n: number) => {
        if (n < 100) return Math.sqrt(n);
        else return 2 * Math.log10(n);
    };

    /**
     * Calculate all the classes range
     */
    const calcClasses = (data: number[], decimalPlaces: number) => {
        const numbers = data.sort((a, b) => a - b);
        const fixedNumbers = numbers.map((number) => number * Math.pow(10, decimalPlaces));

        //get the min and max values
        const minValue: number = fixedNumbers[0];
        const maxValue: number = fixedNumbers[numbers.length - 1];

        //total amplitude
        const totalAmplitude = maxValue - minValue;

        //k = number of classes
        const k = toRound(numOfClasses(numbers.length), 0);
        let classAmplitude = toRound(totalAmplitude / k, 0);

        console.log(classAmplitude);

        const classes: Class[] = [];

        //settng all the classes ranges
        while (!classes.length || classes[classes.length - 1].upper.value < maxValue) {
            let prevClass = minValue;

            for (let i = 0; i < k; i++) {
                classes[i] = {
                    lower: { value: prevClass, included: true },
                    upper: {
                        value: prevClass + classAmplitude,
                        included:
                            prevClass + classAmplitude == maxValue && i == k - 1 ? true : false,
                    },
                    mediumPoint: 0,
                    absFrequency: 0,
                    absAcumFrequency: 0,
                    relFrequency: 0,
                    relAcumFrequency: 0,
                };

                prevClass = toRound(prevClass + classAmplitude, decimalPlaces);
            }

            classAmplitude += 1 / Math.pow(10, decimalPlaces);
        }

        let frequencyAcumulated = 0;
        let absFrequencyAcumulated = 0;

        //calculating frequency for each class
        classes.forEach((classe) => {
            const absFrequency = calcAbsFrequency(classe, fixedNumbers);
            const relativeFrequency = absFrequency / numbers.length;
            const relativeAcumulatedFrequency = relativeFrequency + frequencyAcumulated;
            const absoluteAcumulatedFrequency = absFrequency + absFrequencyAcumulated;

            classe.mediumPoint = classe.lower.value + ((classe.upper.value - classe.lower.value) / 2);
            classe.absFrequency = absFrequency;
            classe.absAcumFrequency = absoluteAcumulatedFrequency;
            classe.relFrequency = relativeFrequency;
            classe.relAcumFrequency = relativeAcumulatedFrequency;

            frequencyAcumulated += relativeFrequency;
            absFrequencyAcumulated += absFrequency;

            classe.lower.value /= Math.pow(10, decimalPlaces);
            classe.upper.value /= Math.pow(10, decimalPlaces);
            classe.mediumPoint /= Math.pow(10, decimalPlaces);
        });

        return classes;
    };

    return { calcClasses, toRound };
}
