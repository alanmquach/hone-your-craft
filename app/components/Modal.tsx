"use client";

import { ChangeEvent, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import { iDToColumnText } from "./Column";

function Modal() {
  const modalRef = useRef<HTMLDivElement>(null);

  const [newJobInput, setNewJobInput] = useBoardStore((state) => [
    state.newJobInput,
    state.setNewJobInput,
  ]);

  const [isOpen, closeModal, selectedCategory, openModal] = useModalStore(
    (state) => [
      state.isOpen,
      state.closeModal,
      state.selectedCategory,
      state.openModal,
    ]
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Set the state of the 'newJobInput' object by spreading its current properties and updating or adding a property based on the 'name' extracted from the event and its corresponding 'value'.
    setNewJobInput({ ...newJobInput, [name]: value });
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Extract the selected category from the event
    const category = e.target.value as TypedColumn;
    // Open the modal with the selected category
    openModal(category);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
        static
      >
        <div
          ref={modalRef}
          className="flex items-center justify-center min-h-full"
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <Dialog.Title className="text-lg font-medium text-center text-gray-900 pb-2">
                  Add Job
                </Dialog.Title>
                <div className="mt-2">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="company"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={newJobInput.company}
                        onChange={handleChange}
                        placeholder="Company"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="postUrl"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Post Url
                      </label>
                      <input
                        type="text"
                        name="postUrl"
                        id="postUrl"
                        value={newJobInput.postUrl}
                        onChange={handleChange}
                        placeholder="+ add URL"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="jobTitle"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={newJobInput.title}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        value={selectedCategory ?? ""}
                        onChange={handleCategoryChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 outline-none"
                      >
                        {Object.entries(iDToColumnText).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Job Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={newJobInput.description}
                        onChange={handleChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Save job
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;