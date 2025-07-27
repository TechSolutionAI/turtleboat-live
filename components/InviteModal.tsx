import styles from './InviteModal.module.css'
import 'react-tagsinput/react-tagsinput.css'

import { useState } from 'react'
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import TagsInput from 'react-tagsinput';
import { Transition } from '@headlessui/react'
import validator from "validator"
import Swal from "sweetalert2"

const InviteModal = ({
  showModal,
  closeFunc
}: {
  showModal: boolean,
  closeFunc: Function
}) => {
  const { data: session } = useSession();
  const user = session?.user as User;

  const onInviteesListChanged = (newInviteesList: Array<string>) => {
    if (newInviteesList.length > invitees.length) {
      let newInvitee: string = newInviteesList[newInviteesList.length - 1];
      if (!validator.isEmail(newInvitee)) {
        setIsValidEmail(true);
        return;
      }
    }
    setInvitees(newInviteesList);
    setIsValidEmail(false);
  };

  const onCloseBtnClicked = () => {
    setInvitees([]);
    setNote('');
    closeFunc();
  };

  // const handleCourseSelected = (value: string) => {
  //   setCourse(value);
  // }

  const onSendInviteBtnClicked = () => {
    const sendInvite = async () => {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitees: invitees,
          courseId: course,
          type: user.role == "admin" ? 0 : 1,
          note: note
        })
      });

      if (!response.ok) {
        const { err } = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
        });
      } else {
        Swal.fire(
          'Thanks!',
          'Your invitation has been sent',
          'success'
        );
        onCloseBtnClicked();
      }
    }

    sendInvite();
  }

  const [invitees, setInvitees] = useState<Array<string>>([]);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [course, setCourse] = useState<string>('');
  const [note, setNote] = useState<string>('');

  return (
    <>
      <Transition
        show={showModal}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0">
        <div
          className={
            `fixed top-0 left-0 right-0 w-full flex 
              justify-center items-center p-4 
              overflow-x-hidden overflow-y-auto 
              md:inset-0 h-[calc(100%-1rem)] max-h-full z-41`
          }>
          <div className="relative w-full max-w-3xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <button
                type="button"
                className={
                  `absolute top-3 right-2.5 
                text-gray-400 bg-transparent 
                hover:bg-gray-200 hover:text-gray-900 
                  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`
                }
                onClick={onCloseBtnClicked}>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd">
                  </path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-4 border-b rounded-t ">
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
                  { user.role == "admin" ? 'Invite' : 'Referral'} to yCITIES CORE Community
                </h3>
              </div>
              <div className="p-6">
                <div>
                  <label className="block mb-2 font-semibold text-black">Refer someone to our Circle of Resources Exchange &#10088;CORE&#10089;.</label>
                  <p className="block mb-2 text-secondary-gray-4">
                    Turtleboat provides a welcoming entry point for resources that have long been limited to a small group of people. A community full of enthusiastic subject-matter-experts &#10088;everyone is a subject-matter-expert in something&#10089;, resources, and learning experiences, our CORE members help each other de-risk ideas and ultimately reach goals.
                  </p>
                  <p className="block mb-2 text-secondary-gray-4">
                    If you believe that you have a contact in your network &#10088;ages 11 to 111&#10089; who is passionate about innovation, willing to share their experiences/perspectives/skills, and excited to learn from others, fill out this referral form and we&#39;ll send them an invitation to become a CORE Member.
                  </p>
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold text-black">Email addresses</label>
                  <TagsInput
                    value={invitees}
                    onChange={onInviteesListChanged}
                    className={styles.tagsinput}
                    tagProps={{
                      'className': styles.tagsinputTag,
                      'classNameRemove': styles.tagsinputRemove
                    }}
                    inputProps={{
                      'className': styles.tagsinputInput,
                      'placeholder': 'Add an email address and press Enter'
                    }} />
                  {
                    isValidEmail &&
                    <p className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Oops!</span> Please input a valid email!
                    </p>
                  }
                </div>
                <div>
                  <label htmlFor="note" className="block mt-2 font-semibold text-black">Add a note to invitation (optional)</label>
                  <textarea rows={4} className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                      placeholder="Write your note here..."
                      id="note"
                      onChange={(e) => {
                          setNote(e.target.value)
                      }}
                      value={note}
                  ></textarea>
                </div>
                {/* {
                  user.role == "admin" && 
                  <div className="mt-8">
                    <label htmlFor="email" className="block mb-2 font-semibold text-secondary-gray-4">Add to a program</label>
                    <p className="font-normal text-secondary-gray-4 mb-2">Add users as mentees for the selected program</p>
                    <CourseSelect 
                      setCourse={handleCourseSelected} 
                      courseValue={null} 
                    />
                  </div>
                } */}
              </div>
              <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                  type="button"
                  className={
                    `text-gray-500 bg-white hover:bg-gray-100 
                    focus:ring-4 focus:outline-none focus:ring-gray-200 
                    rounded-lg border border-gray-200 text-sm font-medium 
                    px-5 py-2.5 hover:text-gray-900 focus:z-10`}
                  onClick={onCloseBtnClicked}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={
                    `text-white bg-primary-blue hover:bg-primary-blue 
                    focus:ring-4 focus:outline-none focus:ring-primary-blue 
                    font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                    `}
                  onClick={onSendInviteBtnClicked}>
                  Send invitation
                </button>
              </div>
            </div>
          </div>
        </div >
      </Transition>
      <div className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${!showModal ? "hidden" : ""}`}></div>
    </>
  );
}

export default InviteModal;