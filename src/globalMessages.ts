const globalMessages = {
    error: {
        title: "Error",
        notFound: "The requested page could not be found.",
        generic: "An error occurred while processing your request.",
        forbidden: "You do not have permission to access this page.",
        unauthorized: "You are not authorized to access this page.",
        notAuthenticated:
            "Please connect and verify your wallet to access this page.",
        requestFailed(term = "the data"): string {
            return `An error occurred fetching ${term}, please try again later`;
        },
    },
    success: {
        title: "Success",
        generic: "Your request was processed successfully.",
    },
    queries: {
        noResults: "No results found",
        noMatchFound: (args: { item?: string; many?: boolean }): string => {
            const { item, many } = args;
            let msg = "No matching ";
            if (item !== undefined) msg = `${msg} ${item} `;
            msg = many === true ? `${msg} items found.` : `${msg} item found.`;
            return msg;
        },
    },
};

export const calendarMessages = {
    noEvents: "No upcoming events",
};

export default globalMessages;
