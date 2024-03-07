"use client";

import { useState, useEffect } from "react";
import { storage } from "./firebase/firebase-config";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { format } from "date-fns";

export default function Dashboard() {
  const [fileList, setFileList] = useState([]);

  const imageListRef = ref(storage, `sop/`);

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      const itemsWithUrls = response.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const metadata = await getMetadata(item);
        const timeCreated = metadata.timeCreated;
        const formattedTimeCreated = format(
          timeCreated,
          "MMMM do yyyy, h:mm:ss a"
        );
        const fileVersion = metadata.customMetadata.version;
        const sopName = metadata.customMetadata.sopName;
        return {
          name: item.name,
          url,
          fileVersion,
          sopName,
          timeCreated: formattedTimeCreated,
        };
      });

      Promise.all(itemsWithUrls).then((items) => setFileList(items));
    });
  }, []);

  let pageHeading = "Udin";

  return (
    <div className="bg-red-400">
      <h1>{pageHeading}</h1>
      <div className="bg-red-400">
        {fileList.map((item) => {
          return (
            <div>
              <p>{item.sopName}</p>
              <p>{item.fileVersion}</p>
              <p>{item.timeCreated}</p>
              <a href={item.url}>download</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
