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

  // const sortByTimeCreated = () => {
  //   console.log("yes");
  //   const sortedList = [...fileList].sort((a, b) => {
  //     return new Date(b.timeCreated) - new Date(a.timeCreated);
  //   });
  //   setFileList(sortedList);
  // };

  return (
    <div className="items-center bg-stone-700 h-screen text-white py-6">
      <h1 className="text-center text-3xl my-6">Daftar SOP</h1>
      {/* <button onClick={sortByTimeCreated}>Order</button> */}
      <div className="flex justify-center">
        <table className="table w-9/12 p-4">
          <thead className="table-header-group">
            <tr className="table-row border-b">
              <td className="table-cell px-6 py-3">Nama</td>
              <td className="table-cell px-6 py-3">Versi</td>
              <td className="table-cell px-6 py-3">Tanggal Upload</td>
              <td className="table-cell px-6 py-3">Aksi</td>
            </tr>
          </thead>
          <tbody className="table-row-group">
            {fileList.map((item) => {
              return (
                <tr key={item.name} className="table-row border-b">
                  <td className="table-cell px-6 py-4">{item.sopName}</td>
                  <td className="table-cell px-6 py-4">{item.fileVersion}</td>
                  <td className="table-cell px-6 py-4">{item.timeCreated}</td>
                  <td className="table-cell px-6 py-4">
                    <a
                      href={item.url}
                      className="hover:text-sky-400 hover:cursor-pointer underline"
                    >
                      download
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
