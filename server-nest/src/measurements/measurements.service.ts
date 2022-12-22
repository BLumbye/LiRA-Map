import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { write } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { Measurement } from 'src/models';

@Injectable()
export class MeasurementsService {
  path: string;

  constructor() {
    this.path = __dirname + '/measurements.json';
  }

  async writeFile(data: any) {
    return await writeFile(this.path, JSON.stringify(data, null, 4), 'utf8');
  }

  async getMeasurements() {
    const file = await readFile(this.path, 'utf-8');
    return JSON.parse(file);
  }

  async addMeasurement(measurement: Measurement) {
    const measurements = await this.getMeasurements();
    const updatedFile = [...measurements, measurement];
    return await this.writeFile(updatedFile);
  }
  /**@author Emil Kim Krarup (s204449), Lucien Kiven Tamo (s184448) */
  async editMeasurement(measurement: Measurement) {
    const measurements = await this.getMeasurements();
    const updatedFile = [...measurements];
    const index = updatedFile.findIndex((m) => m.id === measurement.id);
    updatedFile[index] = measurement;
    return await this.writeFile(updatedFile);
  }
  /**@author Emil Kim Krarup (s204449), Lucien Kiven Tamo (s184448) */
  async deleteMeasurement(measurementID: string) {
    const measurements = await this.getMeasurements();
    const filteredArray = measurements.filter(
      (measurement) => measurement.id !== measurementID,
    );
    return await this.writeFile(filteredArray);
  }
}
