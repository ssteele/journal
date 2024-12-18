import Button from '@/Components/Button';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import React from 'react';

export default function Create({ auth, errors: authErrors }) {
  const today = new Date();

  const initialState = {
    startDate: '',
    endDate: today.toISOString().slice(0, 10),
  };
  const { data, errors, setData } = useForm(initialState);

  function handleSubmit(e) {
    e.preventDefault();

    const url = new URL(route('entries.download-export'));
    const { startDate, endDate } = data;
    if (!!startDate) {
      url.searchParams.append('startDate', data?.startDate);
    }
    if (!!endDate) {
      url.searchParams.append('endDate', data?.endDate);
    }

    // note: you can't trigger export download using ajax (inertiajs)
    document.location = url.toString();

    // @todo: flash notify
    console.log('File exported');
  }

  return (
    <Authenticated
      auth={auth}
      errors={authErrors}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Export
        </h2>
      }
    >
      <Head title="Export" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form
                // encType="multipart/form-data"
                name="createExport"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="mb-4">
                    <label>Start Date</label>
                    <input
                      className="w-full p-4 border-gray-200"
                      label="date"
                      name="date"
                      onChange={e => setData('startDate', e?.target?.value)}
                      type="date"
                      value={data?.startDate}
                    />
                    <span className="text-red-600">
                      {errors?.date}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label>End Date</label>
                    <input
                      className="w-full p-4 border-gray-200"
                      label="date"
                      name="date"
                      onChange={e => setData('endDate', e?.target?.value)}
                      type="date"
                      value={data?.endDate}
                    />
                    <span className="text-red-600">
                      {errors?.date}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button type="submit">Export</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
