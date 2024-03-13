import React, { useState, useEffect, useContext } from "react";
import { NotificationManager } from "react-notifications";
import Swal from "sweetalert2";

import { LoadingContext } from "../../Context/LoadingContext";

import Tabel from "../../Components/Tabel";
import Loading from "../../Components/Loading";

import Form from "./Components/Form";

import { TABEL_META } from "./config";

import { getCars, getCarsDelete } from "../../Data";

import { CATCH_ERROR } from "../../Helper/Error";
import { FORM_TYPES } from "../../Enum/Form";
import InputText from "../../Components/Form/InputText";

const Users = () => {
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataMeta, setDataMeta] = useState({
    tabelHead: TABEL_META,
    coloumnData: [],
  });

  const { dispatchLoading } = useContext(LoadingContext);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: coloumnData } = await getCars();

        setDataMeta({
          tabelHead: TABEL_META,
          coloumnData,
        });
        setIsLoading(false);
      } catch (err) {
        NotificationManager.warning(
          CATCH_ERROR(err),
          "Terjadi Kesalahan",
          5000
        );
      }
    };

    getUserData();

    dispatchLoading(false);
  }, [dispatchLoading]);

  const RenderEditForm = ({ data }) => {
    const { id } = data;

    return (
      <Form
        id={id}
        buttonLabel=""
        buttonIcon="fas fa-edit fa-xs"
        form={data}
        formType={FORM_TYPES.EDIT}
        idModal={`editForm-${id}`}
      />
    );
  };

  const confirmDeleteHandel = (data) => {
    const { merek, id } = data;

    Swal.fire({
      title: "Apakah anda yakin akan menghapus Data ini",
      text: `Menghapus Mobil - ${merek}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Iya, Hapus data ini!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await getCarsDelete(id);
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success",
          text: "Berhasil Menghapus data, halaman ini akan di mulai ulang",
          icon: "success",
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });
  };

  const filterHandel = async (val) => {
    setFilter(val);

    try {
      const { data: coloumnData } = await getCars({ merek: val });

      setDataMeta({ tabelHead: TABEL_META, coloumnData });
    } catch (err) {
      NotificationManager.warning(CATCH_ERROR(err), "Terjadi Kesalahan", 5000);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-12 d-flex justify-content-end">
          <Form />
        </div>
        <div className="col-sm-12 my-2">
          <InputText
            value={filter}
            placeholder="Cari Merek Mobil"
            changeEvent={(val) => filterHandel(val)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {isLoading ? (
            <div className="container h-100">
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                <Loading title="Memuat..." />
              </div>
            </div>
          ) : (
            <Tabel
              title="List Mobil"
              dataMeta={dataMeta}
              actionButton={{
                view: { enabled: false },
                edit: {
                  enabled: false,
                  customModal: (val) => <RenderEditForm data={val} />,
                },
                delete: {
                  enabled: true,
                  onClick: (val) => {
                    confirmDeleteHandel(val);
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
