const express = require("express");
const router = express.Router();
const ModelDpi = require("../model/modelDpi.js");
const ModelUser = require("../model/modelUser.js");

router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await ModelUser.getId(id);
    let rows = await ModelDpi.getAll();
    if (Data.length > 0) {
      res.render("dpi/index", { data: rows, email: Data[0].email });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", function (req, res, next) {
  res.render("dpi/create", {
    nama_dpi: "",
    luas: "",
  });
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama_dpi, luas } = req.body;
    let data = {
      nama_dpi: nama_dpi,
      luas: luas,
    };
    await ModelDpi.store(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/dpi");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/dpi");
  }
});

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await ModelDpi.getById(id);
    res.render("dpi/edit", {
      id: rows[0].id_dpi,
      nama_dpi: rows[0].nama_dpi,
      luas: rows[0].luas,
    });
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/dpi");
  }
});

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_dpi, luas } = req.body;
    let data = {
      nama_dpi: nama_dpi,
      luas: luas,
    };
    await ModelDpi.update(id, data);
    req.flash("success", "Berhasil memperbarui data");
    res.redirect("/dpi");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/dpi");
  }
});

router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await ModelDpi.delete(id);
    req.flash("success", "Berhasil menghapus data");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
  }
  res.redirect("/dpi");
});

module.exports = router;
