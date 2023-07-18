import { Component } from '@angular/core';
import { PDFDocument, PDFForm } from 'pdf-lib';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pdfSrc = "assets/form.pdf";
  pngUrl = "assets/sign.png";
  title = 'pdf-filler';

  async onCreate() {
    const pdfDoc = await PDFDocument.create()

    const page = pdfDoc.addPage([550, 750])

    const form = pdfDoc.getForm()

    page.drawText('Enter your favorite superhero:', { x: 50, y: 700, size: 20 })

    const superheroField = form.createTextField('favorite.superhero')
    superheroField.setText('One Punch Man')
    superheroField.addToPage(page, { x: 55, y: 640 })
    console.log(superheroField.getText())

    page.drawText('Select your favorite rocket:', { x: 50, y: 600, size: 20 })

    page.drawText('Falcon Heavy', { x: 120, y: 560, size: 18 })
    page.drawText('Saturn IV', { x: 120, y: 500, size: 18 })
    page.drawText('Delta IV Heavy', { x: 340, y: 560, size: 18 })
    page.drawText('Space Launch System', { x: 340, y: 500, size: 18 })

    const rocketField = form.createRadioGroup('favorite.rocket')
    rocketField.addOptionToPage('Falcon Heavy', page, { x: 55, y: 540 })
    rocketField.addOptionToPage('Saturn IV', page, { x: 55, y: 480 })
    rocketField.addOptionToPage('Delta IV Heavy', page, { x: 275, y: 540 })
    rocketField.addOptionToPage('Space Launch System', page, { x: 275, y: 480 })
    rocketField.select('Saturn IV')

    page.drawText('Select your favorite gundams:', { x: 50, y: 440, size: 20 })

    page.drawText('Exia', { x: 120, y: 400, size: 18 })
    page.drawText('Kyrios', { x: 120, y: 340, size: 18 })
    page.drawText('Virtue', { x: 340, y: 400, size: 18 })
    page.drawText('Dynames', { x: 340, y: 340, size: 18 })

    const exiaField = form.createCheckBox('gundam.exia')
    const kyriosField = form.createCheckBox('gundam.kyrios')
    const virtueField = form.createCheckBox('gundam.virtue')
    const dynamesField = form.createCheckBox('gundam.dynames')

    exiaField.addToPage(page, { x: 55, y: 380 })
    kyriosField.addToPage(page, { x: 55, y: 320 })
    virtueField.addToPage(page, { x: 275, y: 380 })
    dynamesField.addToPage(page, { x: 275, y: 320 })

    exiaField.check()
    dynamesField.check()

    page.drawText('Select your favorite planet*:', { x: 50, y: 280, size: 20 })

    const planetsField = form.createDropdown('favorite.planet')
    planetsField.addOptions(['Venus', 'Earth', 'Mars', 'Pluto'])
    planetsField.select('Pluto')
    planetsField.addToPage(page, { x: 55, y: 220 })

    page.drawText('Select your favorite person:', { x: 50, y: 180, size: 18 })

    const personField = form.createOptionList('favorite.person')
    personField.addOptions([
      'Julius Caesar',
      'Ada Lovelace',
      'Cleopatra',
      'Aaron Burr',
      'Mark Antony',
    ])
    personField.select('Ada Lovelace')
    personField.addToPage(page, { x: 55, y: 70 })

    page.drawText(`* Pluto should be a planet too!`, { x: 15, y: 15, size: 15 })

    const pdfBytes = await pdfDoc.save()
    console.log("PDF saved")

    const file = new Blob([pdfBytes], {type: 'attachment/pdf'});
    FileSaver.saveAs(file, "form.pdf");
  }

  async onSave() {

    // Get the input field elements from dom here

    const formPdfBytes = await fetch(this.pdfSrc).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(formPdfBytes)

    const page = pdfDoc.getPage(0)
    const form = pdfDoc.getForm()

    const superheroField = form.getTextField('favorite.superhero')
    // console.log(document.querySelector("#\\31 1R"));
    superheroField.setText('Hello World!!')
    console.log(superheroField.getText())

    // add e-signature
    const pngImageBytes = await fetch(this.pngUrl).then((res) => res.arrayBuffer())
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const pngDims = pngImage.scale(0.5)

    page.drawImage(pngImage, {
      x: 400,
      y: 50,
      width: 200,
      height: 50,
    })

    // form.flatten()

    const pdfBytes = await pdfDoc.save()
    console.log("PDF saved")

    const file = new Blob([pdfBytes], {type: 'attachment/pdf'});
    FileSaver.saveAs(file, "filled.pdf");

    // update the pdf resource on the pdf frame -- optional
    var blobURL = URL.createObjectURL(file);
    this.pdfSrc = blobURL;
    console.log(blobURL);
  }
}
