function isValidDate(dateString, res) {
    // 1. Check the format
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dateString)) {
        res.status(400).send({
            status: "failed",
            message:"please write correct date!"
        })
    }

    // 2. Extract year, month, day
    const [year, month, day] = dateString.split("-").map(Number);

    // 3. Create the Date object
    const date = new Date(year, month - 1, day);

    // 4. Check if the date itself is valid
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        res.status(400).send({
            status: "failed",
            message: "please write correct date!"
        })
    }

    // 5. Minimum date
    const minDate = new Date(1950, 0, 1);

    // 6. Today
    const today = new Date();

    // 7. Check range
    if (date < minDate || date > today) {
        res.status(400).send({
            status: "failed",
            message: "please write date from 1950 to now"
        })
    }

    return true;
}

module.exports = isValidDate