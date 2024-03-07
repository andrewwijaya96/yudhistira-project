"use client";

import { useState, useEffect } from "react";
import { storage } from "../firebase/firebase-config";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { format } from "date-fns";

export default function Dashboard() {
  const [fileList, setFileList] = useState([]);
  const [displayList, setDisplayList] = useState([]);

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

      Promise.all(itemsWithUrls).then((items) => {
        const sortedItems = items.sort((a, b) => {
          console.log("a.timeCreated:", Date(a.timeCreated));
          console.log("b.timeCreated:", Date(b.timeCreated));
          return Date(b.timeCreated) - Date(a.timeCreated);
        });
        console.log(sortedItems);
        setFileList(sortedItems);
      });
    });
  }, []);

  const sortByTimeCreated = () => {
    console.log("yes");
    const sortedList = [...fileList].sort((a, b) => {
      return new Date(b.timeCreated) - new Date(a.timeCreated);
    });
    setFileList(sortedList);
  };

  return (
    <div>
      <h1 className="ml-24 text-3xl my-6">Daftar SOP</h1>
      <button onClick={sortByTimeCreated}>Order</button>
      <div className="flex justify-center flex-col items-center">
        <div className="grid grid-cols-6 w-5/6 bg-gray-100">
          <span className="col-span-3">Nama</span>
          <span className="col-span-1">Versi</span>
          <span className="col-span-1">Tanggal Upload</span>
          <span className="col-span-1">Aksi</span>
        </div>
        {fileList.map((item) => {
          return (
            <div key={item.name} className="grid grid-cols-6 w-5/6 my-2">
              <span className="col-span-3">{item.sopName}</span>
              <span className="col-span-1">{item.fileVersion}</span>
              <span className="col-span-1">{item.timeCreated}</span>
              <span className="col-span-1">
                <a
                  href={item.url}
                  className="hover:text-sky-400 hover:cursor-pointer"
                >
                  download
                </a>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
