const Cryptage = {
    toBase64: (str) => {
        return btoa(
            encodeURIComponent(str).replace(
                /%([0-9A-F]{2})/g,
                (_, p1) => String.fromCharCode("0x" + p1)
            )
        );
    },
    fromBase64: (str) => {
        return decodeURIComponent(
            atob(str)
                .split("")
                .map(
                    (c) =>
                        "%" +
                        ("00" + c.charCodeAt(0).toString(16)).slice(
                            -2
                        )
                )
                .join("")
        );
    },
    encode: (input, shiftAmount = 7) => {
        const base64Encoded = Cryptage.toBase64(input);
        let base64UrlEncoded = base64Encoded
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const len = base64UrlEncoded.length;
        shiftAmount = shiftAmount % len;
        return (
            base64UrlEncoded.slice(shiftAmount) +
            base64UrlEncoded.slice(0, shiftAmount)
        );
    },
    decode: (encodedText, shiftAmount = 7) => {
        const len = encodedText.length;
        shiftAmount = shiftAmount % len;
        const shiftedBack =
            encodedText.slice(-shiftAmount) +
            encodedText.slice(0, -shiftAmount);

        const base64Encoded = shiftedBack
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(
                shiftedBack.length +
                    ((4 - (shiftedBack.length % 4)) % 4),
                "="
            );

        return Cryptage.fromBase64(base64Encoded);
    },
};