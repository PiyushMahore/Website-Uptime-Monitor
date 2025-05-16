import { apiError } from "./apiError.js";
import { WebUrl } from "../models/webUrl.model.js";
import https from 'https';

const fetchUrls = async (url) => {
    if (!url) {
        throw new apiError(404, "url field is empty");
    }

    return new Promise((resolve, reject) => {
        const timings = {
            nameLookupTime: 0,
            connectionTime: 0,
            tlsHandshakeTime: 0,
            dataTransferStart: 0,
            dataTransferTime: 0,
        };

        timings.start = Date.now();

        const request = https.get(url.Urls, (response) => {
            timings.statusCode = response.statusCode;

            response.on('data', () => {
                if (!timings.dataTransferStart) {
                    timings.dataTransferStart = Date.now();
                }
            });

            response.on('end', async () => {
                timings.responseEnd = Date.now();
                timings.dataTransferTime = timings.dataTransferStart
                    ? timings.responseEnd - timings.dataTransferStart
                    : 0;

                timings.totalTime = timings.nameLookupTime + timings.connectionTime + timings.tlsHandshakeTime + timings.dataTransferTime;

                const finalTimings = {
                    nameLookupTime: timings.nameLookupTime,
                    connectionTime: timings.connectionTime,
                    tlsHandshakeTime: timings.tlsHandshakeTime,
                    dataTransferTime: timings.dataTransferTime,
                    totalTime: timings.totalTime,
                    statusCode: timings.statusCode,
                    date: new Date(Date.now())
                };

                try {
                    const urlDescription = await WebUrl.findById(url._id);
                    urlDescription.statusCode = response.statusCode;
                    if (response.statusCode > 400) {
                        urlDescription.incidents += 1;
                    }
                    await urlDescription.save({ validateBeforeSave: false });
                } catch (err) {
                    console.error("Error updating URL:", err);
                }

                resolve(finalTimings);
            });
        });

        request.on('socket', (socket) => {
            socket.on('lookup', () => {
                timings.nameLookupTime = Date.now() - timings.start;
            });

            socket.on('connect', () => {
                timings.connectionTime = Date.now() - timings.nameLookupTime - timings.start;
            });

            socket.on('secureConnect', () => {
                timings.tlsHandshakeTime = Date.now() - timings.connectionTime - timings.nameLookupTime - timings.start;
            });
        });

        request.on('error', (error) => {
            console.error('Error fetching the URL:', error);
            WebUrl.findByIdAndDelete(url._id)
                .then(() => {
                    reject(new apiError(500, "Failed to fetch the URL"));
                })
                .catch((err) => {
                    console.error("Error updating URL on error:", err);
                    reject(new apiError(500, "Failed to fetch the URL"));
                });
        });
    });
};

export { fetchUrls };
