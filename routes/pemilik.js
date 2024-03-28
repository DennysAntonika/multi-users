const express = require("express");
const router = express.Router();
const ModelPemilik = require("../model/modelPemilik.js");
const ModelUser = require("../model/modelUser.js");

router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await ModelUser.getId(id);
    let rows = await ModelPemilik.getAll();
    if (Data.length > 0) {
      res.render("pemilik/index", { data: rows, email: Data[0].email });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", function (req, res, next) {
  res.render("pemilik/create", {
    nama_pemilik: "",
    alamat: "",
    no_hp: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama_pemilik, alamat, no_hp } = req.body;
    let data = {
      nama_pemilik: nama_pemilik,
      alamat: alamat,
      no_hp: no_hp,
    };
    await ModelPemilik.store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/pemilik");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/pemilik");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await ModelPemilik.getById(id);
    res.render("pemilik/edit", {
      id: rows[0].id_pemilik,
      nama_pemilik: rows[0].nama_pemilik,
      alamat: rows[0].alamat,
      no_hp: rows[0].no_hp,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/pemilik");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_pemilik, alamat, no_hp } = req.body;
    let data = {
      nama_pemilik: nama_pemilik,
      alamat: alamat,
      no_hp: no_hp,
    };
    await ModelPemilik.update(id, data);
    req.flash("success", "Berhasil memperbarui data");
    res.redirect("/pemilik");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/pemilik");
  }
});

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await ModelPemilik.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/pemilik");
});

module.exports = router;
