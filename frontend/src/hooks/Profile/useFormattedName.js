const useFormattedName = (lastName, firstName, middleName) => {

    const formatName = (name) =>
        name
            ?.toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    return `${formatName(lastName)}, ${formatName(firstName)} ${middleName ? formatName(middleName).charAt(0) + "." : ""}`;
};

export default useFormattedName;
