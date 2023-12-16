export function getProviderBaseUrl(): string {
    return getBaseUrl("provider") + "/provider"
}

export function getBookingBaseUrl(): string {
    return getBaseUrl("booking") + "/booking"
}

export function getAllBookingByPaymentUrl(): string {
    return getPaymentBaseUrl() + "/user/getAllBooking"
}

export function getUserPaymentCompleteUrl(): string {
    return getPaymentBaseUrl() + "/user/completed"
}

export function getPaymentBaseUrl(): string {
    return getBaseUrl("payment") + "/payment"
}

export function getPaymentBaseUrlWithUser(): string {
    return getPaymentBaseUrl() + "/user"
}

export function getProviderEarningsDetailsUrl(userId: number): string {
    return getPaymentBaseUrl() + "/proider/totalEarnings/" + userId
}

export function getChargerBaseUrl(): string {
    return getBaseUrl("provider") + "/charger"
}

export function getChargerRateUrl(providerId: number): string {
    return getBaseUrl("provider") + "/provider/" + providerId + "/chargerandrate"
}

function getBaseUrl(services: string): string {
    if (process.env.NEXT_PUBLIC_REACT_APP_ENV != "local") {
        return String(process.env.NEXT_PUBLIC_REACT_APP_BASE_URL)
    }
    console.log("using nonlive configurations ")
    switch (services) {
        case "user":
            return "http://localhost:8080/api/v1"
        case "booking":
            return "http://localhost:8081/api/v1"
        case "provider":
            return "http://localhost:8082/api/v1"
        case "payment":
            return "http://localhost:8083/api/v1"
    }

    return "http://localhost:8081/api/v1"
}
