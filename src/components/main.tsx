import React, { useEffect, useRef, useState } from "react";
import Card from "./card";
import { ReactComponent as FirstPage } from "../icons/doubleLeft.svg";
import { ReactComponent as PreviousPage } from "../icons/left.svg";
import { ReactComponent as NextPage } from "../icons/right.svg";
import { ReactComponent as LastPage } from "../icons/doubleRight.svg";
import { ReactComponent as Edit } from "../icons/edit.svg";
import { ReactComponent as Delete } from "../icons/delete.svg";
import { ReactComponent as Save } from "../icons/save.svg";
import { ReactComponent as Cancel } from "../icons/cancel.svg";
import { isDisabled } from "@testing-library/user-event/dist/utils";

interface ItemType {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Main = () => {
  const API =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const itemsPerPage = 10;
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedItemId, setEditedItemId] = useState<string | null>(null);
  const [editedItemName, setEditedItemName] = useState<string | null>(null);
  const [editedItemEmail, setEditedItemEmail] = useState<string | null>(null);
  const [editedItemRole, setEditedItemRole] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  //FETCHING DATA
  useEffect(() => {
    fetch(API)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, []);

  //FILTERING
  useEffect(() => {
    const filtered = items.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
    setSelectAll(false);
  }, [searchQuery, items]);

  //PAGINATION
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setEditedItemId(null);
    setSelectAll(false);
  };

  //EDIT A ITEM

  const handleEdit = (
    itemId: string,
    itemName: string,
    itemEmail: string,
    itemRole: string
  ) => {
    setEditedItemId(itemId);
    setEditedItemName(itemName);
    setEditedItemEmail(itemEmail);
    setEditedItemRole(itemRole);
  };

  const handleSave = (item: ItemType) => {
    setItems((prevItems) =>
      prevItems.map((prevItem) => (prevItem.id === item.id ? item : prevItem))
    );
    setEditedItemId(null);
  };

  const handleCancelEdit = () => {
    setEditedItemId(null);
  };

  //DELETE A ITEM

  const handleDelete = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setEditedItemId(null);
  };

  //HANDLE MULTIPLE SELECTION OF ITEMS
  const handleToggleSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== itemId)
      );
      setSelectAll(false);
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, itemId]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    setItems((prevItems) =>
      prevItems.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
    setEditedItemId(null);
  };

  return (
    <div className="text-sm">
      {/* search bar */}
      <input
        placeholder="Search"
        className="border border-slate-300 rounded px-2 py-1 mt-3 mx-3 w-[200px] focus:border-slate-400 outline-none"
        type="search"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="border border-slate-300 rounded m-3 px-2 ">
        {/* column name */}
        <div className="flex justify-center items-center w-full text-gray-400 ">
          <div className="w-[3%] flex items-center  px-1">
            <label>
              <input
                className="h-3.5 w-3.5"
                type="checkbox"
                checked={selectAll}
                onChange={handleToggleSelectAll}
                disabled={currentItems.length === 0}
              />
            </label>
          </div>

          <div className="w-[76%] ">
            <Card name={"Name"} email={"Email"} role={"Role"} />
          </div>

          <div className="flex items-center w-[20%] px-1">Actions</div>
        </div>

        <div className="w-full bg-slate-400">
          <hr />
        </div>

        {/* main */}

        {currentItems &&
          currentItems.map((item) => {
            return (
              <div key={item.id}>
                {editedItemId === item.id ? (
                  <>
                    <div className="flex  items-center w-full py-2">
                      <div className="w-[3%] flex  items-center px-1 h-5 "></div>
                      <input
                        className=" w-[22.5%] py-1 px-2 border rounded ml-4 mr-1 focus:border-slate-400 outline-none"
                        type="text"
                        value={editedItemName ? editedItemName : ""}
                        onChange={(e) => setEditedItemName(e.target.value)}
                      />
                      <input
                        className=" w-[38.5%] py-1 px-2 border rounded mx-1 focus:border-slate-400 outline-none "
                        type="text"
                        value={editedItemEmail ? editedItemEmail : ""}
                        onChange={(e) => setEditedItemEmail(e.target.value)}
                      />
                      <input
                        className="w-[15%] py-1 px-2 border rounded mx-1 focus:border-slate-400 outline-none"
                        type="text"
                        value={editedItemRole ? editedItemRole : ""}
                        onChange={(e) => setEditedItemRole(e.target.value)}
                      />
                      <div className="w-[20%] px-1 mr-3 ml-1">
                        <button
                          title="Save"
                          className="border-slate-300 border px-[7px] py-[5px] rounded mx-1"
                          onClick={() =>
                            handleSave({
                              ...item,
                              name: editedItemName ? editedItemName : "",
                              role: editedItemRole ? editedItemRole : "",
                              email: editedItemEmail ? editedItemEmail : "",
                            })
                          }
                        >
                          <Save width={"11px"} />
                        </button>
                        <button
                          title="Cancel"
                          className=" border-slate-300 border px-[7px] py-[5px] rounded mx-1"
                          onClick={handleCancelEdit}
                        >
                          <Cancel width={"10px"} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-400">
                      <hr />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`flex justify-center items-center w-full ${
                        selectedItems.includes(item.id) ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="w-[3%] flex  items-center px-1 ">
                        <label>
                          <input
                            className="h-3.5 w-3.5"
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleToggleSelect(item.id)}
                          />
                        </label>
                      </div>

                      <div className="w-[76%] ">
                        <Card
                          name={item.name}
                          email={item.email}
                          role={item.role}
                        />
                      </div>

                      <div className="flex items-center w-[20%] px-1 ">
                        <button
                          title="Edit"
                          className=" border-slate-300 border px-[7px] py-[5px] rounded mx-1"
                          onClick={() => {
                            handleEdit(
                              item.id,
                              item.name,
                              item.email,
                              item.role
                            );
                          }}
                        >
                          <Edit width={"12px"} />
                        </button>

                        <button
                          title="Delete"
                          className=" border-slate-300 border px-[7px] py-[5px] rounded mx-1"
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                        >
                          <Delete width={"10px"} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-400">
                      <hr />
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>

      {/* footer (delete button and pagination)*/}

      {filteredItems.length !== 0 && (
        <div className="flex justify-between mx-3">
          <button
            className="py-1 px-2 border rounded-md bg-red-400 text-white hover:bg-red-500 disabled:bg-red-400"
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
          >
            Delete Selected
          </button>

          <div className=" flex justify-center items-center">
            <div className="mx-10">
              Page {currentPage} of {Math.ceil(filteredItems.length / 10)}
            </div>
            <button
              title="FirstPage"
              className={`border border-slate-300 py-1 px-[6px] rounded ml-1 ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <FirstPage width={"12px"} />
            </button>
            <button
              title="PreviousPage"
              className={`border border-slate-300 py-1 px-2 rounded ml-1 ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <PreviousPage width={"7px"} />
            </button>

            {Array.from(
              { length: Math.ceil(filteredItems.length / itemsPerPage) },
              (_, index) => (
                <button
                  className={`border border-slate-300 py-[4px] px-[8px] rounded ml-1 text-xs ${
                    currentPage == index + 1
                      ? "bg-slate-200 border-slate-200"
                      : ""
                  }`}
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              title="NextPage"
              className={`border border-slate-300 py-1 px-2 rounded ml-1 ${
                currentPage === Math.ceil(filteredItems.length / 10)
                  ? "opacity-50"
                  : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
              }
            >
              <NextPage width={"7px"} />
            </button>
            <button
              title="LastPage"
              className={`border border-slate-300 py-1 px-[6px] rounded ml-1 ${
                currentPage === Math.ceil(filteredItems.length / 10)
                  ? "opacity-50"
                  : ""
              }`}
              onClick={() =>
                handlePageChange(Math.ceil(filteredItems.length / itemsPerPage))
              }
              disabled={
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
              }
            >
              <LastPage width={"12px"} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
