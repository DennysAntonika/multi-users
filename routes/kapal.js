const express = require("express");
const router = express.Router();
const ModelKapal = require("../model/kapal.js");
const ModelPemilik = require("../model/modelPemilik.js");
const ModelDpi = require("../model/modelDpi.js");
const ModelAlatTangkap = require("../model/alatTangkap.js");
const ModelUser = require("../model/modelUser.js");

router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await ModelUser.getId(id);
    let rows = await ModelKapal.getAll();
    let pemilikData = await ModelPemilik.getAll();
    let dpiData = await ModelDpi.getAll();
    let alatTangkapData = await ModelAlatTangkap.getAll();
    if (Data.length > 0) {
      res.render("kapal/index", {
        data: rows,
        email: Data[0].email,
        pemilik: pemilikData,
        dpi: dpiData,
        alatTangkap: alatTangkapData,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await ModelUser.getId(id);
    let pemilikData = await ModelPemilik.getAll();
    let dpiData = await ModelDpi.getAll();
    let alatTangkapData = await ModelAlatTangkap.getAll();
    if (Data.length > 0) {
      res.render("alat/index", {
        data: rows,
        email: Data[0].email,
        pemilik: pemilikData,
        dpi: dpiData,
        alatTangkap: alatTangkapData,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
  res.render("kapal/create", {
    pemilik: pemilikData,
    dpi: dpiData,
    alatTangkap: alatTangkapData,
  });
});

router.post("/store", async function (req, res, next) {
  try {
    // Ambil data dari form
    let { nama_kapal, id_pemilik, id_dpi, id_alat_tangkap } = req.body;
    // Masukkan data ke dalam objek
    let data = {
      nama_kapal: nama_kapal,
      id_pemilik: id_pemilik,
      id_dpi: id_dpi,
      id_alat_tangkap: id_alat_tangkap,
    };
    // Simpan data menggunakan model
    await ModelKapal.store(data);
    req.flash("success", "Berhasil menyimpan data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/kapal");
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let kapalData = await ModelKapal.getById(id);
    let pemilikData = await ModelPemilik.getAll();
    let dpiData = await ModelDpi.getAll();
    let alatTangkapData = await ModelAlatTangkap.getAll();

    // Jika tidak ada data kapal, kirimkan pesan error
    if (!kapalData) {
      throw new Error("Data kapal tidak ditemukan");
    }

    res.render("kapal/edit", {
      id: id,
      nama_kapal: kapalData.nama_kapal || "", // Pastikan ini sesuai dengan struktur data Anda
      pemilik: pemilikData,
      dpi: dpiData,
      alatTangkap: alatTangkapData,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/kapal");
  }
});

// Rute untuk mengupdate data
router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    // Ambil data dari form
    let { nama_kapal, id_pemilik, id_dpi, id_alat_tangkap } = req.body;
    // Masukkan data ke dalam objek
    let data = {
      nama_kapal: nama_kapal,
      id_pemilik: id_pemilik,
      id_dpi: id_dpi,
      id_alat_tangkap: id_alat_tangkap,
    };
    // Update data menggunakan model
    await ModelKapal.update(id, data);
    req.flash("success", "Berhasil memperbarui data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/kapal");
});

// Rute untuk menghapus data
router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    // Hapus data menggunakan model
    await ModelKapal.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/kapal");
});

module.exports = router;
