const express = require("express");
const router = express.Router();
const ModelAlatTangkap = require("../model/alatTangkap.js");
const ModelUser = require("../model/modelUser.js");

router.get("/", async function (req, res, next) {
  try {
    let rows = await ModelAlatTangkap.getAll();
    let id = req.session.userId;
    let Data = await ModelUser.getId(id);
    if (Data.length > 0) {
      res.render("alat/index", { data: rows, email: Data[0].email });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", function (req, res, next) {
  res.render("alat/create", {
    nama_alat_tangkap: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama_alat_tangkap } = req.body;
    let data = {
      nama_alat_tangkap: nama_alat_tangkap,
    };
    await ModelAlatTangkap.store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/alat");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/alat");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await ModelAlatTangkap.getById(id);
    res.render("alat/edit", {
      id: rows[0].id_alat_tangkap,
      nama_alat_tangkap: rows[0].nama_alat_tangkap,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/alat");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_alat_tangkap } = req.body;
    let data = {
      nama_alat_tangkap: nama_alat_tangkap,
    };
    await ModelAlatTangkap.update(id, data);
    req.flash("success", "Berhasil memperbarui data");
    res.redirect("/alat");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/alat");
  }
});

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await ModelAlatTangkap.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/alat");
});

module.exports = router;
