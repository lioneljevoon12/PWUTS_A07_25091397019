$(document).ready(function () {
  var STORAGE_KEY = 'meownesa_cats_data';

  function getStoredCats() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.catsData || [];
  }

  var cats = getStoredCats();

  function saveCats() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
    } catch (e) {}
  }

  function renderCats(data) {
    var $tbody = $('#catsTableBody');
    $tbody.empty();
    if (!data.length) {
      $tbody.append('<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--ink-muted);">Tidak ada data kucing yang sesuai filter.</td></tr>');
      return;
    }
    data.forEach(function (cat) {
      var statusBadge = cat.status === 'AVAILABLE'
        ? '<span class="badge-gold">SIAP DIADOPSI</span>'
        : '<span class="badge-green">TERDATA AKTIF</span>';
      var sterilBadge = (cat.steril && cat.steril.indexOf('Sudah') !== -1)
        ? '<span class="badge-steril">&check; ' + cat.steril + '</span>'
        : '<span class="badge-unsteril">&minus; ' + cat.steril + '</span>';
      var genderClass = cat.gender === 'Betina' ? 'gender-betina' : 'gender-jantan';
      var tr = '<tr>' +
        '<td><div class="cat-cell"><img src="' + cat.img + '" alt="' + cat.name + '" class="cat-thumb" onerror="this.src=\'brand/cat.png\'"><div><div class="cat-name">' + cat.name + '</div><div class="cat-desc">' + cat.desc + '</div></div></div></td>' +
        '<td><div class="tag-id">' + cat.tagCode + '</div><div class="tag-collar">' + cat.collarColor + '</div></td>' +
        '<td><div style="font-weight: 700; font-size: 0.82rem;">' + cat.campus + '</div><div style="font-size: 0.72rem; color: var(--ink-muted);">' + cat.location + '</div></td>' +
        '<td><div class="' + genderClass + '">' + cat.gender + '</div><div style="font-size: 0.72rem; color: var(--ink-muted);">&plusmn; ' + cat.age + '</div></td>' +
        '<td>' + sterilBadge + '<div style="font-size: 0.72rem; color: var(--ink-muted); margin-top: 3px;">' + cat.vaccine + '</div></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td><div style="display: flex; gap: 4px;">' +
          '<button type="button" class="btn-icon btn-detail-cat" data-id="' + cat.id + '" title="Lihat Detail">&#128065;</button>' +
          '<button type="button" class="btn-icon btn-edit-cat" data-id="' + cat.id + '" title="Edit Data">&#9998;</button>' +
          '<button type="button" class="btn-icon btn-delete-cat" data-id="' + cat.id + '" title="Hapus">&#128465;</button>' +
        '</div></td>' +
      '</tr>';
      $tbody.append(tr);
    });
  }

  function applyFilters() {
    var search = $('#searchCat').val().toLowerCase().trim();
    var campus = $('#filterCampus').val();
    var status = $('#filterStatus').val();
    var gender = $('#filterGender').val();
    var filtered = cats.filter(function (c) {
      var matchSearch = !search ||
        c.name.toLowerCase().indexOf(search) !== -1 ||
        c.tagCode.toLowerCase().indexOf(search) !== -1 ||
        c.location.toLowerCase().indexOf(search) !== -1;
      var matchCampus = !campus || c.campus === campus;
      var matchStatus = !status || c.status === status;
      var matchGender = !gender || c.gender === gender;
      return matchSearch && matchCampus && matchStatus && matchGender;
    });
    renderCats(filtered);
  }

  function clearErrors() {
    $('.field-error').text('').hide();
    $('.form-control').removeClass('input-error');
  }

  function showError($field, $err, msg) {
    $field.addClass('input-error');
    $err.text(msg).show();
  }

  $(document).off('.cats');

  $(document).on('input.cats', '#searchCat', applyFilters);
  $(document).on('change.cats', '#filterCampus, #filterStatus, #filterGender', applyFilters);

  $(document).on('click.cats', '.btn-detail-cat', function () {
    var id = $(this).data('id');
    var cat = cats.find(function (c) { return c.id === id; });
    if (!cat) return;
    $('#modalCatImg').attr('src', cat.img);
    $('#modalCatName').text(cat.name);
    $('#modalCatTag').text(cat.tagCode);
    $('#modalCatCampus').text(cat.campus);
    $('#modalCatLocation').text(cat.location);
    $('#modalCatCollar').text(cat.collarColor);
    $('#modalCatGender').text(cat.gender);
    $('#modalCatAge').text(cat.age);
    $('#modalCatSteril').text(cat.steril);
    $('#modalCatVaccine').text(cat.vaccine);
    $('#modalCatDesc').text(cat.desc);
    $('#modalCat').fadeIn(200);
  });

  $(document).on('click.cats', '#closeModalCat, #btnCloseModalCat, #modalCat', function (e) {
    if (e.target === this) {
      $('#modalCat').fadeOut(150);
    }
  });

  $(document).on('click.cats', '#btnOpenAddCat', function () {
    clearErrors();
    $('#modalFormCatTitle').text('Tambah Kucing Kampus Baru');
    $('#editCatId').val('');
    $('#editCatName').val('');
    $('#editCatTag').val('');
    $('#editCatCampus').val('Kampus Ketintang');
    $('#editCatLocation').val('');
    $('#editCatCollar').val('');
    $('#editCatGender').val('Betina');
    $('#editCatAge').val('');
    $('#editCatSteril').val('Sudah Steril');
    $('#editCatVaccine').val('Vaksin Lengkap (Nusantara Vet)');
    $('#editCatStatus').val('AVAILABLE');
    $('#editCatDesc').val('');
    $('#modalEditCat').fadeIn(200);
  });

  $(document).on('click.cats', '.btn-edit-cat', function () {
    clearErrors();
    var id = $(this).data('id');
    var cat = cats.find(function (c) { return c.id === id; });
    if (!cat) return;
    $('#modalFormCatTitle').text('Ubah Data Kucing Kampus');
    $('#editCatId').val(cat.id);
    $('#editCatName').val(cat.name);
    $('#editCatTag').val(cat.tagCode);
    $('#editCatCampus').val(cat.campus);
    $('#editCatLocation').val(cat.location);
    $('#editCatCollar').val(cat.collarColor);
    $('#editCatGender').val(cat.gender);
    $('#editCatAge').val(cat.age);
    $('#editCatSteril').val(cat.steril);
    $('#editCatVaccine').val(cat.vaccine);
    $('#editCatStatus').val(cat.status);
    $('#editCatDesc').val(cat.desc);
    $('#modalEditCat').fadeIn(200);
  });

  $(document).on('click.cats', '#closeModalEditCat, #btnCancelEditCat, #modalEditCat', function (e) {
    if (e.target === this) {
      $('#modalEditCat').fadeOut(150);
    }
  });

  $(document).on('submit.cats', '#formEditCat', function (e) {
    e.preventDefault();
    clearErrors();
    var isValid = true;
    var name = $('#editCatName').val().trim();
    var tag = $('#editCatTag').val().trim();
    var campus = $('#editCatCampus').val();
    var loc = $('#editCatLocation').val().trim();
    var collar = $('#editCatCollar').val().trim();
    var gender = $('#editCatGender').val();
    var age = $('#editCatAge').val().trim();
    var steril = $('#editCatSteril').val();
    var vac = $('#editCatVaccine').val().trim();
    var status = $('#editCatStatus').val();
    var desc = $('#editCatDesc').val().trim();

    if (!name || name.length < 2) {
      showError($('#editCatName'), $('#errCatName'), 'Nama wajib diisi minimal 2 karakter.');
      isValid = false;
    }
    if (!tag || tag.length < 3) {
      showError($('#editCatTag'), $('#errCatTag'), 'Kode tag wajib diisi minimal 3 karakter.');
      isValid = false;
    }
    if (!loc || loc.length < 3) {
      showError($('#editCatLocation'), $('#errCatLocation'), 'Lokasi teritorial wajib diisi minimal 3 karakter.');
      isValid = false;
    }
    if (!collar || collar.length < 3) {
      showError($('#editCatCollar'), $('#errCatCollar'), 'Warna kalung reflektif wajib diisi.');
      isValid = false;
    }
    if (!age || age.length < 1) {
      showError($('#editCatAge'), $('#errCatAge'), 'Perkiraan usia wajib diisi.');
      isValid = false;
    }
    if (!vac || vac.length < 3) {
      showError($('#editCatVaccine'), $('#errCatVaccine'), 'Informasi vaksin wajib diisi.');
      isValid = false;
    }
    if (!desc || desc.length < 5) {
      showError($('#editCatDesc'), $('#errCatDesc'), 'Deskripsi karakter wajib diisi minimal 5 karakter.');
      isValid = false;
    }
    if (!isValid) return;

    var editId = $('#editCatId').val();
    if (editId) {
      var cat = cats.find(function (c) { return c.id === editId; });
      if (cat) {
        cat.name = name; cat.tagCode = tag; cat.campus = campus;
        cat.location = loc; cat.collarColor = collar; cat.gender = gender;
        cat.age = age; cat.steril = steril; cat.vaccine = vac;
        cat.status = status; cat.desc = desc;
      }
    } else {
      var newCat = {
        id: 'cat-' + Date.now(), name: name, tagCode: tag,
        collarColor: collar, campus: campus, location: loc,
        gender: gender, age: age, status: status,
        steril: steril, vaccine: vac, img: 'kucing/KTT-01.jpg', desc: desc
      };
      cats.unshift(newCat);
    }

    saveCats();
    applyFilters();
    $('#modalEditCat').fadeOut(150);
  });

  $(document).on('click.cats', '.btn-delete-cat', function () {
    var id = $(this).data('id');
    if (confirm('Yakin ingin menghapus anabul ini dari daftar?')) {
      cats = cats.filter(function (c) { return c.id !== id; });
      saveCats();
      applyFilters();
    }
  });

  renderCats(cats);
});