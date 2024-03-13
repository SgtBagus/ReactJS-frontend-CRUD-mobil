import Badge from "../../Components/Badge";
import DateRender from "../../Components/Tabels/DateRender";

const TYPE_ENUM = {
  SUV: 'SUV',
  SEDAN: 'Sedan',
};

export const TYPE_LIST = [
  {
    value: 'SUV',
    option: 'SUV',
  },
  {
    value: 'Sedan',
    option: 'Sedan',
  },
]

export const TABEL_META = [
  {
    title: "Merek Mobil",
    key: "merek",
  },
  {
    key: "jenis",
    title: "Jenis Mobil",
		Cell: (val) => (val === TYPE_ENUM.SUV ? (<Badge className="badge bg-primary" label="SUV" />) : (<Badge className="badge bg-info" label="SEDAN" />))
  },
  {
    key: "stok",
    title: "Stock",
  },
  {
    key: "price",
    title: "Harga",
    Cell: (val) => (<span> {new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR"}).format(val)} </span>)
  },
  {
    key: "keterangan",
    title: "Keterangan",
  },
  {
    key: "created_at",
    title: "Dibuat Pada",
		Cell: (val) => (<DateRender val={val} />)
  },
  {
    key: "updated_at",
    title: "Diupdate Pada",
		Cell: (val) => (<DateRender val={val} />)
  },
];