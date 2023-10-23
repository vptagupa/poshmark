const axios = require("axios");
const fs = require("fs");

var request = {
    filters: {
        department: "All",
        inventory_status: ["available"],
    },
    query_and_facet_filters: { department: "All" },
    sort_by: "best_match",
    query: "nike",
    facets: ["brand", "color", "department"],
    experience: "all",
};

fetchProducts(request);

function fetchProducts(request) {
    axios
        .get("https://poshmark.com/vm-rest/posts", {
            params: { request: JSON.stringify(request) },
        })
        .then((response) => {
            // The response is corresponds to the specified page or max_id
            // by default the max_id is 1 if there is no specified max_id in the request params
            // To check either there is available next page, find the next_max_id in the more field
            writeJsonFile(response.data.data.map((data) => responseData(data)));
        })
        .catch((error) => {
            console.log(error);
        });
}

function responseData(data) {
    return {
        id: data.id,
        creator_id: data.creator_id,
        status: data.status,
        status_changed_at: data.status_changed_at,
        origin_domain: data.origin_domain,
        destination_domains: data.destination_domains,
        publish_count: data.publish_count,
        app: data.app,
        inventory: data.inventory,
        catalog: data.catalog,
    };
}

function writeJsonFile(data) {
    const jsonData = JSON.stringify({ data });
    const filePath = "data.json";

    fs.writeFile(filePath, jsonData, "utf8", (err) => {
        if (err) {
            console.error("Error writing to the file:", err);
        } else {
            console.log("JSON data has been written to", filePath);
        }
    });
}
