interface FileData {
    [key: string]: any;
}

interface Item {
    fileUrl: string;
}

export function transformData(items: Item[]): FileData {
    const result: FileData = {};

    items.forEach(item => {
        try {
            const decodedUrl = decodeURIComponent(item.fileUrl);
            const urlObj = new URL(decodedUrl);
            const ipAddress = urlObj.hostname;
            const pathParts = urlObj.pathname.split('/').filter(part => part);

            if (!result[ipAddress]) {
                result[ipAddress] = [];
            }

            addPath(result[ipAddress], pathParts);
        } catch (error) {
            console.error(`Error processing item: ${item.fileUrl}`, error);
        }
    });

    return result;
}

function addPath(tree: any[], pathParts: string[]) {
    if (pathParts.length === 0) {
        return;
    }

    const currentPart = pathParts.shift() as string;

    if (pathParts.length === 0) {
        tree.push(currentPart);
        return;
    }

    let dirEntry = tree.find(entry => typeof entry === 'object' && entry.hasOwnProperty(currentPart));
    if (!dirEntry) {
        dirEntry = { [currentPart]: [] };
        tree.push(dirEntry);
    }

    addPath(dirEntry[currentPart], pathParts);
}
