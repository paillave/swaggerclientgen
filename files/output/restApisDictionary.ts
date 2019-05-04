export const RestApisDictionary = {
    Entities: {
        Get: {
            path: "/api/Entities/{id}",
            method: "GET"
        },
        Delete: {
            path: "/api/Entities/{id}",
            method: "DELETE"
        },
        GetAll: {
            path: "/api/Entities",
            method: "GET"
        },
        Save: {
            path: "/api/Entities",
            method: "POST"
        },
    },
    ProfileAccount: {
        Current: {
            path: "/api/ProfileAccount/Current",
            method: "GET"
        },
    },
    SampleData: {
        WeatherForecasts: {
            path: "/api/SampleData/WeatherForecasts",
            method: "GET"
        },
    },
    Securities: {
        Get: {
            path: "/api/Securities/{id}",
            method: "GET"
        },
        Delete: {
            path: "/api/Securities/{id}",
            method: "DELETE"
        },
        GetAll: {
            path: "/api/Securities",
            method: "GET"
        },
        Save: {
            path: "/api/Securities",
            method: "POST"
        },
    },
};