class DataPortability {
    exportMemory(state) {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `ozo_journey_memory_${new Date().toISOString().slice(0,10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            return true;
        } catch (e) {
            console.error("Export failed: ", e);
            return false;
        }
    }

    importMemory(file, callback) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                callback(true, parsed);
            } catch (e) {
                console.error("Failed to parse JSON file", e);
                callback(false, null);
            }
        };
        reader.readAsText(file);
    }
}
window.DataPortability = new DataPortability();
